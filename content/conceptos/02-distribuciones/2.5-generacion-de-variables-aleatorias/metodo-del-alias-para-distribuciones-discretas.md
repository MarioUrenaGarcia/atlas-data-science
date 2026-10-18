---
id: metodo-del-alias-para-distribuciones-discretas
titulo: Método del alias para distribuciones discretas
titulo_en: Alias method
alias:
  - método del alias
  - algoritmo de Walker
  - método de Vose
modulo: 2
submodulo: '2.5'
orden: 10
nivel: avanzado
prerrequisitos:
  - distribucion-categorica
  - generadores-de-numeros-pseudoaleatorios
relaciones:
  - tipo: contrasta
    id: muestreo-por-transformada-inversa
etiquetas:
  - distribuciones discretas
  - tablas
  - tiempo constante
  - simulación
  - categórica
resumen: >
  Permite sortear de una distribución discreta con k valores en tiempo constante: se reparte la masa en
  k columnas de altura uno, cada una con a lo más dos valores, y cada extracción usa una columna y una moneda.
formula: 'P(X = i) = \frac{1}{k}\Big(q_i + \sum_{j:\,a_j = i}(1 - q_j)\Big)'
visualizacion:
  componente: RandomLab
  parametros:
    modo: alias
    pesos: [0.1, 0.5, 0.15, 0.25]
    casos:
      - nombre: 'Tipos de vehículo'
        descripcion: 'Motos 0.1, autos 0.5, camiones 0.15 y autobuses 0.25: la columna de los autos queda completa y presta su sobrante a las otras.'
        valores: {w0: 0.1, w1: 0.5, w2: 0.15, w3: 0.25}
      - nombre: 'Casi uniforme'
        descripcion: 'Pesos parecidos: casi todas las columnas tienen a su propia categoría completa y el alias casi nunca se usa.'
        valores: {w0: 0.24, w1: 0.26, w2: 0.25, w3: 0.25}
      - nombre: 'Una categoría dominante'
        descripcion: 'Una categoría con 0.85: aparece como alias en casi todas las columnas.'
        valores: {w0: 0.05, w1: 0.85, w2: 0.05, w3: 0.05}
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Una simulación de tráfico necesita sortear millones de veces el tipo de cada vehículo que llega: motos, autos, camiones o autobuses, con probabilidades conocidas. El método más directo acumula las probabilidades y busca en qué tramo cae una uniforme, lo que con $k$ categorías cuesta del orden de $k$ comparaciones (o $\log k$ con búsqueda binaria). El método del alias hace cada extracción con una sola consulta a una tabla, sin importar cuántas categorías haya.

El truco es repartir las probabilidades en $k$ columnas de la misma altura. Se multiplican todas por $k$, de modo que en promedio valen uno. Las categorías con valor mayor que uno tienen sobrante y las que tienen valor menor que uno tienen hueco; se rellena cada hueco con un pedazo del sobrante de otra categoría, su "alias". Al final cada columna mide uno y contiene a lo más dos categorías: la suya, con una fracción $q$, y su alias, con el resto.

Para sortear, se elige una columna al azar y se lanza una moneda con probabilidad $q$ de quedarse con la categoría propia; si sale lo contrario, se devuelve el alias. Construir la tabla cuesta del orden de $k$ operaciones una sola vez; cada extracción después cuesta lo mismo, sea cual sea $k$.

## Definición

:::definicion[Tabla de alias]
Para probabilidades $p_1, \dots, p_k$, una **tabla de alias** consta de umbrales $q_1, \dots, q_k \in [0, 1]$ y alias $a_1, \dots, a_k \in \{1, \dots, k\}$ tales que
$$
p_i = \frac{1}{k}\Big(q_i + \sum_{j:\,a_j = i}(1 - q_j)\Big).
$$
Para sortear: $J$ uniforme en $\{1, \dots, k\}$ y $V$ uniforme en $(0, 1)$; si $V < q_J$ se devuelve $J$, si no, $a_J$.
:::

La construcción de Vose reparte las categorías en "pequeñas" ($kp_i < 1$) y "grandes" ($kp_i \ge 1$); en cada paso una pequeña $s$ fija $q_s = kp_s$ y toma como alias a una grande $l$, que pierde $1 - q_s$ de su masa y pasa a pequeña si queda por debajo de uno.

:::nota[Qué es X]
$X$ = la categoría sorteada, una de $k$ posibles, como el tipo de vehículo que llega a una caseta.
:::

:::nota[Qué hace cada parámetro]
- **$w_i$, peso de la categoría $i$:** su probabilidad antes de normalizar. Si aumenta, su columna se llena por completo y la categoría aparece como alias de otras.
- **$k$, número de categorías:** el número de columnas. El costo de cada extracción no cambia con $k$.
:::

:::nota[Qué significa cada símbolo]
- $p_i$: probabilidad de la categoría $i$; $k$: número de categorías.
- $q_i$: fracción de la columna $i$ que pertenece a la propia categoría.
- $a_i$: alias de la columna $i$, la categoría que ocupa el resto.
- $J$: columna sorteada; $V$: moneda uniforme.
:::

## Cómo usar la visualización

A la izquierda está la tabla: cada columna mide uno, con su propia categoría abajo, en color intenso, y su alias arriba, en color claro. A la derecha se comparan las frecuencias de las extracciones (barras) con las probabilidades (contornos punteados). Cada paso de la reproducción hace una extracción y la línea horizontal marca dónde cayó la moneda en la columna elegida; el botón agrega 1000. Los controles cambian los pesos. Los casos cargan tipos de vehículo, pesos casi uniformes y una categoría dominante.

Reproduce paso a paso y observa que cada extracción mira una sola columna. Agrega 3000 extracciones y comprueba que las barras alcanzan los contornos. Carga la categoría dominante y observa que su color aparece arriba de casi todas las columnas.

## Ejemplo

Los tipos de vehículo tienen probabilidades motos 0.1, autos 0.5, camiones 0.15 y autobuses 0.25, con $k = 4$.

1. Multiplicadas por 4: 0.4, 2, 0.6 y 1. Pequeñas: motos (0.4) y camiones (0.6); grandes: autos (2) y autobuses (1).
2. Camiones toma como alias a autobuses: $q_{\text{camiones}} = 0.6$ y a autobuses le quedan $1 - 0.4 = 0.6$, que ahora es pequeña.
3. Autobuses toma como alias a autos: $q_{\text{autobuses}} = 0.6$ y a autos le quedan $2 - 0.4 = 1.6$.
4. Motos toma como alias a autos: $q_{\text{motos}} = 0.4$ y a autos le queda exactamente 1, su columna completa.
5. Comprobación para autos: $\frac{1}{4}\big(1 + (1 - 0.4) + (1 - 0.6)\big) = \frac{2}{4} = 0.5$.

:::figura[Tipos de vehículo: la tabla de 4 columnas de altura 1 y, a la derecha, las frecuencias de las extracciones frente a las probabilidades 0.1, 0.5, 0.15 y 0.25.]{componente="RandomLab"}
```yaml
modo: alias
pesos: [0.1, 0.5, 0.15, 0.25]
```
:::

## Propiedades

- **Costo constante:** cada extracción necesita una uniforme (o dos) y una comparación, sin importar $k$.
- **Construcción lineal:** la tabla se arma en tiempo proporcional a $k$.
- **Dos valores por columna:** siempre existe una tabla con a lo más dos categorías por columna, porque cada paso deja completa una columna.
- **Una sola uniforme:** se puede usar $U$ para ambas decisiones: $J = \lfloor kU \rfloor$ y la moneda $kU - J$.
- **Cuándo conviene:** si se sortea muchas veces de la misma distribución; si las probabilidades cambian con frecuencia, reconstruir la tabla cada vez anula la ventaja.
- **Comparación:** la transformada inversa con búsqueda binaria cuesta del orden de $\log k$ por extracción.

:::figura[Casos con contexto (tipos de vehículo, casi uniforme, una categoría dominante): cada botón carga los pesos y una frase explica cómo se llena la tabla.]{componente="RandomLab"}
```yaml
modo: alias
pesos: [0.24, 0.26, 0.25, 0.25]
casos:
  - nombre: 'Tipos de vehículo'
    descripcion: 'Autos llenan su columna y prestan el sobrante.'
    valores: {w0: 0.1, w1: 0.5, w2: 0.15, w3: 0.25}
  - nombre: 'Casi uniforme'
    descripcion: 'El alias casi no se usa.'
    valores: {w0: 0.24, w1: 0.26, w2: 0.25, w3: 0.25}
  - nombre: 'Una categoría dominante'
    descripcion: 'Aparece como alias en casi todas las columnas.'
    valores: {w0: 0.05, w1: 0.85, w2: 0.05, w3: 0.05}
```
:::

:::figura[Más categorías, mismo costo: con seis categorías la tabla tiene seis columnas y cada extracción sigue mirando una sola.]{componente="RandomLab"}
```yaml
modo: alias
pesos: [0.05, 0.3, 0.1, 0.25, 0.2, 0.1]
```
:::

## Errores comunes

- **Pensar que cada columna corresponde a una sola categoría.** Una columna puede devolver dos categorías distintas, la propia y su alias.
- **Olvidar normalizar los pesos.** La construcción supone que las probabilidades suman uno; con pesos sin normalizar se dividen entre su suma.
- **Usar el método para una distribución que cambia en cada paso.** El costo de construir la tabla se paga cada vez y conviene la transformada inversa.
- **Confundir la tabla con un histograma.** La altura de la parte propia de cada columna no es la probabilidad de la categoría; la probabilidad suma también los pedazos que aparecen como alias en otras columnas.

:::figura[Columna no es probabilidad: en la tabla de los vehículos, la parte propia de los autobuses mide 0.6, pero su probabilidad es 0.25 porque además aparece como alias de los camiones.]{componente="RandomLab"}
```yaml
modo: alias
pesos: [0.1, 0.5, 0.15, 0.25]
semilla: 9
```
:::

## Conexiones

Muestrea la [[distribucion-categorica]] y, repitiendo, la [[distribucion-multinomial]], a partir de [[generadores-de-numeros-pseudoaleatorios]]. Contrasta con el [[muestreo-por-transformada-inversa]], que recorre la función de distribución acumulada. Es el análogo discreto de las tablas del [[algoritmo-ziggurat]]. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Probabilidad desde la tabla]
$$
p_i = \frac{1}{k}\Big(q_i + \sum_{j:\,a_j = i}(1 - q_j)\Big)
$$

- $q_i$: parte propia de la columna $i$; $a_j$: alias de la columna $j$; $k$: categorías.
:::

:::formula[Extracción]
$$
J = \lfloor kU \rfloor + 1, \qquad X = \begin{cases} J & \text{si } kU - \lfloor kU \rfloor < q_J \\ a_J & \text{si no} \end{cases}
$$

- $U$: uniforme; $\lfloor\cdot\rfloor$: parte entera.
:::

:::formula[Escalamiento inicial]
$$
\tilde{p}_i = k\,p_i, \qquad \text{pequeña si } \tilde{p}_i < 1, \quad \text{grande si } \tilde{p}_i \ge 1
$$

- $\tilde{p}_i$: probabilidad escalada.
:::
