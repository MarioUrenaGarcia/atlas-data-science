---
id: coeficiente-phi
titulo: Coeficiente phi
titulo_en: Phi coefficient
alias:
  - phi
  - coeficiente de correlación de Matthews
  - correlación de dos variables binarias
modulo: 4
submodulo: '4.5'
orden: 10
nivel: basico
prerrequisitos:
  - tablas-de-contingencia
  - coeficiente-de-correlacion-de-pearson
etiquetas:
  - asociación
  - variables binarias
  - tabla de 2 por 2
  - chi cuadrada
resumen: >
  El coeficiente phi mide la asociación entre dos variables binarias en una tabla de 2 por 2. Es la
  correlación de Pearson de sus códigos 0 y 1 y vale entre -1 y 1.
formula: '\phi = \frac{ad - bc}{\sqrt{(a+b)(c+d)(a+c)(b+d)}}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: contingencia
    enfoque: phi
    filas:
      nombre: Vacunado
      categorias: [Sí, No]
    columnas:
      nombre: Se enfermó
      categorias: [No, Sí]
    conteos:
      - [30, 10]
      - [20, 40]
referencias:
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

En una tabla de 2 por 2 hay dos diagonales. Si los casos se concentran en una diagonal, por ejemplo vacunados que no se enfermaron y no vacunados que sí, las variables están asociadas en un sentido; si se concentran en la otra diagonal, en el sentido opuesto; si se reparten de forma proporcional, no hay asociación. El **coeficiente phi** convierte ese desequilibrio entre diagonales en un número entre $-1$ y $1$.

La forma más simple de entenderlo es codificar cada variable con 0 y 1 y calcular la correlación de Pearson de esos códigos: el resultado es exactamente phi. Por eso se interpreta como una correlación: cerca de 1, las dos variables casi siempre coinciden; cerca de 0, son casi independientes. El producto $ad$ de la diagonal principal frente al producto $bc$ de la otra diagonal decide el signo.

## Definición

:::definicion[Coeficiente phi]
Para una tabla de 2 por 2 con conteos
$$
\begin{array}{c|cc} & Y = 1 & Y = 0 \\ \hline X = 1 & a & b \\ X = 0 & c & d \end{array}
$$
el **coeficiente phi** es
$$
\phi = \frac{ad - bc}{\sqrt{(a+b)(c+d)(a+c)(b+d)}}.
$$
Su valor absoluto se relaciona con la estadística chi cuadrada: $|\phi| = \sqrt{\chi^2/n}$.
:::

El signo depende de cómo se ordenan las categorías; lo que importa es en qué diagonal se concentran los casos. Con las categorías codificadas como 1 y 0, $\phi$ coincide con la correlación de Pearson de las dos variables binarias.

:::figura[Asociación fuerte: hábito de fumar y tos crónica en 100 adultos. Los casos se concentran en la diagonal principal y phi es 0.70.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: phi
filas:
  nombre: Fuma
  categorias: [Sí, No]
columnas:
  nombre: Tos crónica
  categorias: [Sí, No]
conteos:
  - [45, 5]
  - [10, 40]
```
:::

:::nota[Qué significa cada símbolo]
- $\phi$: coeficiente phi.
- $a$, $b$, $c$, $d$: conteos de las cuatro celdas, leídos por filas.
- $ad - bc$: diferencia entre los productos de las dos diagonales.
- $a+b$, $c+d$: totales de las filas; $a+c$, $b+d$: totales de las columnas.
- $\chi^2$: estadística chi cuadrada de la tabla; $n = a + b + c + d$: total de observaciones.
:::

## Cómo usar la visualización

La tabla cruza vacunación y enfermedad en 100 personas. La reproducción recorre las cuatro celdas mostrando su conteo esperado bajo independencia; al final, el encabezado calcula phi con los productos de las diagonales. Las barras comparan el porcentaje de enfermos en cada fila.

Entre los vacunados, 25 % se enfermó; entre los no vacunados, 67 %. Las barras de las dos filas son muy distintas y phi vale 0.41. Si las dos barras fueran iguales, $ad$ y $bc$ coincidirían y phi sería cero.

## Ejemplo

De 40 vacunados, 30 no se enfermaron y 10 sí; de 60 no vacunados, 20 no se enfermaron y 40 sí. Con $a = 30$, $b = 10$, $c = 20$ y $d = 40$:

1. Productos de las diagonales: $ad = 30 \cdot 40 = 1200$ y $bc = 10 \cdot 20 = 200$.
2. Totales: filas $40$ y $60$; columnas $50$ y $50$.
3. $\phi = \dfrac{1200 - 200}{\sqrt{40 \cdot 60 \cdot 50 \cdot 50}} = \dfrac{1000}{\sqrt{6{,}000{,}000}} = \dfrac{1000}{2449.5} \approx 0.408$.
4. Comprobación: $\chi^2 = 16.67$ y $\sqrt{16.67/100} \approx 0.408$.

:::figura[El mismo cálculo con las categorías de la columna invertidas (primero "Sí se enfermó"): los conteos cambian de diagonal y phi vale -0.408. La magnitud de la asociación no cambia.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: phi
filas:
  nombre: Vacunado
  categorias: [Sí, No]
columnas:
  nombre: Se enfermó
  categorias: [Sí, No]
conteos:
  - [10, 30]
  - [40, 20]
```
:::

## Propiedades

- **Es una correlación de Pearson** de dos variables codificadas con 0 y 1.
- **Rango:** $-1 \le \phi \le 1$; vale 0 si y solo si las filas tienen los mismos porcentajes.
- **Relación con chi cuadrada:** $\phi^2 = \chi^2/n$.
- **El máximo depende de las marginales:** si los totales de filas y columnas no son iguales, phi no puede llegar a 1 aunque la asociación sea la más fuerte posible.

:::figura[Máximo restringido por las marginales: en una prueba de detección, todas las personas sanas dan negativo, pero hay más enfermos (50) que resultados positivos (20). Aunque ninguna celda contradice la asociación más fuerte posible, phi es solo 0.5.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: phi
filas:
  nombre: Condición real
  categorias: [Sana, Enferma]
columnas:
  nombre: Resultado
  categorias: [Negativo, Positivo]
conteos:
  - [50, 0]
  - [30, 20]
```
:::

## Errores comunes

- **Interpretar el signo sin revisar el orden de las categorías.** Cambiar el orden de una variable cambia el signo.
- **Comparar phi entre tablas con marginales muy distintas.** El máximo alcanzable cambia de una tabla a otra.
- **Usarlo en tablas más grandes que 2 por 2.** Para más categorías, $\sqrt{\chi^2/n}$ puede superar 1; se usa la V de Cramér.

:::figura[Con pocas observaciones, una asociación moderada es poco confiable: 32 estudiantes, asistencia a asesorías y aprobación. Phi es 0.38, pero mover unas cuantas personas de celda la cambia mucho.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: phi
filas:
  nombre: Asistió a asesorías
  categorias: [Sí, No]
columnas:
  nombre: Aprobó
  categorias: [Sí, No]
conteos:
  - [12, 4]
  - [6, 10]
```
:::

## Conexiones

El coeficiente phi es el [[coeficiente-de-correlacion-de-pearson]] aplicado a dos variables binarias, organizadas en una [[tablas-de-contingencia|tabla de contingencia]] de 2 por 2. Su generalización a tablas mayores es la [[v-de-cramer]]. En aprendizaje automático se conoce como coeficiente de correlación de Matthews y se usa para evaluar clasificadores binarios con clases desbalanceadas.

## Formulario

:::formula[Coeficiente phi]
$$
\phi = \frac{ad - bc}{\sqrt{(a+b)(c+d)(a+c)(b+d)}}
$$

- $a, b, c, d$: conteos de la tabla de 2 por 2.
:::

:::formula[Relación con chi cuadrada]
$$
\phi^2 = \frac{\chi^2}{n}
$$

- $\chi^2$: estadística chi cuadrada; $n$: total de observaciones.
:::

:::formula[Chi cuadrada]
$$
\chi^2 = \sum_{i,j}\frac{(n_{ij} - E_{ij})^2}{E_{ij}}
$$

- $n_{ij}$: conteo observado; $E_{ij}$: conteo esperado bajo independencia.
:::
