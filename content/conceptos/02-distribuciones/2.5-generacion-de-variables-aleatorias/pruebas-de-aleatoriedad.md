---
id: pruebas-de-aleatoriedad
titulo: Pruebas de aleatoriedad
titulo_en: Tests of randomness
alias:
  - pruebas de generadores
  - prueba de frecuencias
  - prueba de corridas
  - baterías de pruebas
modulo: 2
submodulo: '2.5'
orden: 5
nivel: intermedio
prerrequisitos:
  - generadores-de-numeros-pseudoaleatorios
  - distribucion-chi-cuadrada
relaciones:
  - tipo: relacionado
    id: generador-congruencial-lineal
etiquetas:
  - pruebas estadísticas
  - ji cuadrada
  - corridas
  - correlación serial
  - calidad de generadores
resumen: >
  Pruebas estadísticas que buscan desviaciones de la uniformidad o de la independencia en la salida de un
  generador: frecuencias por clases, corridas, correlación serial y vectores en varias dimensiones.
formula: '\chi^{2} = \sum_{j=1}^{k}\frac{(O_j - n/k)^{2}}{n/k} \;\approx\; \chi^{2}_{k-1} \quad \text{si los } U_i \text{ son uniformes independientes}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: pruebas
    generador: mt
    valores:
      n: 2000
      k: 10
      semilla: 1
    casos:
      - nombre: 'Generador bueno'
        descripcion: 'Mersenne Twister, 2000 valores: ji cuadrada 5.28 con valor p 0.81 y corridas sin desviación; no hay motivo para rechazar.'
        valores: {n: 2000, k: 10, semilla: 1}
      - nombre: 'Muestra chica'
        descripcion: 'Con 200 valores los conteos fluctúan mucho más; las pruebas tienen poca potencia para detectar defectos pequeños.'
        valores: {n: 200, k: 10, semilla: 1}
      - nombre: 'Muchas clases'
        descripcion: 'Con 20 clases y 10000 valores cada clase espera 500; la prueba detecta desviaciones más finas.'
        valores: {n: 10000, k: 20, semilla: 1}
referencias:
  - clave: ross-procesos
  - clave: agresti
publicado: true
---

## Intuición

¿Cómo saber si un generador produce números que se comportan como aleatorios? No se puede probar directamente, pero sí se puede buscar evidencia en contra. Si los números fueran uniformes, cada décima parte del intervalo de cero a uno debería recibir alrededor de una décima parte de los valores. Si fueran independientes, el número de veces que la sucesión cambia de subir a bajar debería estar cerca de lo esperado, y un valor no debería anticipar al siguiente.

Cada una de esas expectativas da una prueba estadística. Se calcula un estadístico con los números producidos y se compara con su distribución bajo la hipótesis de que son uniformes e independientes. Un valor p muy pequeño indica un patrón improbable y hace sospechar del generador.

Ninguna prueba demuestra que un generador sea bueno: solo puede encontrar defectos. Por eso se usan baterías con decenas o cientos de pruebas, que examinan la sucesión en muchas dimensiones y escalas. Un generador que las pasa todas no es aleatorio, pero es indistinguible de uno para los usos que esas pruebas representan.

## Definición

:::definicion[Prueba de frecuencias]
Se divide $[0, 1)$ en $k$ clases iguales y se cuentan las observaciones $O_1, \dots, O_k$ de $n$ valores. Bajo la hipótesis de uniformidad,
$$
\chi^{2} = \sum_{j=1}^{k}\frac{(O_j - n/k)^{2}}{n/k} \approx \chi^{2}_{k-1}.
$$
:::

:::definicion[Prueba de corridas arriba y abajo]
Una **corrida** es un tramo máximo en el que la sucesión solo sube o solo baja. Si los valores son independientes y continuos, el número $R$ de corridas en $n$ valores tiene
$$
\mathbb{E}[R] = \frac{2n - 1}{3}, \qquad \operatorname{Var}(R) = \frac{16n - 29}{90},
$$
y $Z = (R - \mathbb{E}[R])/\sqrt{\operatorname{Var}(R)}$ es aproximadamente normal estándar.
:::

La **correlación serial** de orden 1 mide la dependencia lineal entre $u_i$ y $u_{i+1}$; para valores independientes es del orden de $1/\sqrt{n}$.

:::nota[Qué es X]
$U_1, \dots, U_n$ = la muestra de números producida por el generador que se pone a prueba.
:::

:::nota[Qué hace cada parámetro]
- **$n$, tamaño de muestra:** cuántos valores se examinan. Si aumenta, las pruebas detectan defectos más pequeños.
- **$k$, número de clases:** la finura de la prueba de frecuencias. Si aumenta, se detectan irregularidades más locales, pero cada clase espera menos valores.
- **Generador:** el algoritmo examinado. El sesgado acumula valores pequeños; el congruencial pequeño reparte de forma demasiado perfecta pero tiene dependencia entre valores.
:::

:::nota[Qué significa cada símbolo]
- $k$: número de clases; $O_j$: conteo observado en la clase $j$; $n/k$: conteo esperado.
- $\chi^{2}$: estadístico de Pearson; $\chi^{2}_{k-1}$: chi-cuadrada con $k - 1$ grados.
- $R$: número de corridas; $Z$: estadístico estandarizado.
- $n$: número de valores.
:::

## Cómo usar la visualización

Las barras son los conteos de cada clase y la línea punteada el conteo esperado $n/k$; las barras a más de dos desviaciones de lo esperado cambian de color. El panel da la ji cuadrada con su valor p, las corridas observadas y esperadas con su valor p y la correlación serial, e indica si se rechaza la uniformidad al 5 %. Los casos cargan un generador bueno, una muestra chica y muchas clases.

Cambia al generador sesgado y observa barras decrecientes y un valor p prácticamente cero. Elige el congruencial con $m = 256$: la ji cuadrada es sospechosamente chica, pero la prueba de corridas lo rechaza. Cambia la semilla del Mersenne Twister varias veces y observa que de vez en cuando una prueba rechaza por azar.

## Ejemplo

Se examinan 2000 valores del Mersenne Twister (semilla 1) y 2000 de un generador defectuoso que eleva cada uniforme a la potencia 1.3.

1. Mersenne Twister, 10 clases: cada clase espera 200; la ji cuadrada vale 5.28 con 9 grados y valor p 0.81. No se rechaza.
2. Sus corridas son 1340 frente a $\frac{2 \cdot 2000 - 1}{3} \approx 1333$ esperadas, con $Z = 0.37$ y valor p 0.71.
3. Generador sesgado: los conteos van de 323 en la primera clase a 159 en la última; la ji cuadrada vale 127.9 y el valor p es prácticamente cero. Se rechaza la uniformidad.
4. Congruencial con $m = 256$: la ji cuadrada vale solo 0.75, demasiado buena para ser azar, y las corridas son 1280 frente a 1333, con $Z = -2.81$ y valor p 0.005. Se rechaza la independencia.

:::figura[Generador sesgado: los conteos bajan de la primera a la última clase y la ji cuadrada de 127.9 rechaza la uniformidad sin dudas.]{componente="RandomLab"}
```yaml
modo: pruebas
generador: sesgado
valores:
  n: 2000
  k: 10
  semilla: 7
```
:::

## Propiedades

- **Solo refutan:** pasar una prueba no prueba aleatoriedad; fallarla da evidencia de un defecto.
- **Falsas alarmas:** al nivel 0.05, un generador perfecto falla una prueba una de cada veinte veces; un fallo aislado no basta para descartarlo.
- **Demasiado bueno también es malo:** una ji cuadrada muy cercana a cero (valor p cercano a 1) indica valores repartidos con una regularidad imposible para el azar.
- **Varias dimensiones:** las pruebas sobre pares y ternas, como la de espaciamientos o la de huecos, detectan defectos que el histograma no ve.
- **Baterías:** Diehard, TestU01 y PractRand reúnen cientos de pruebas; los generadores modernos pasan sus versiones más exigentes.
- **Potencia y tamaño:** con $n$ grande se detectan desviaciones pequeñas; las baterías usan miles de millones de valores.

:::figura[Casos con contexto (generador bueno, muestra chica, muchas clases): cada botón carga n, k y la semilla del Mersenne Twister.]{componente="RandomLab"}
```yaml
modo: pruebas
generador: mt
valores:
  n: 200
  k: 10
  semilla: 1
casos:
  - nombre: 'Generador bueno'
    descripcion: 'p = 0.81: sin evidencia en contra.'
    valores: {n: 2000, k: 10, semilla: 1}
  - nombre: 'Muestra chica'
    descripcion: 'Conteos más irregulares, poca potencia.'
    valores: {n: 200, k: 10, semilla: 1}
  - nombre: 'Muchas clases'
    descripcion: 'Detecta desviaciones más finas.'
    valores: {n: 10000, k: 20, semilla: 1}
```
:::

:::figura[Demasiado perfecto: el congruencial con m = 256 reparte sus valores casi sin error (ji cuadrada 0.75), pero la prueba de corridas lo rechaza con valor p 0.005.]{componente="RandomLab"}
```yaml
modo: pruebas
generador: lcg-pequeno
valores:
  n: 2000
  k: 10
  semilla: 7
```
:::

## Errores comunes

- **Descartar un buen generador por un solo rechazo.** Con la semilla 7, el Mersenne Twister obtiene $Z = -2.12$ en la prueba de corridas, valor p 0.034; es una falsa alarma esperable.
- **Mirar solo el histograma.** Un generador con frecuencias perfectas puede tener dependencia fuerte entre valores consecutivos.
- **Usar muy pocos valores.** Con muestras chicas las pruebas casi nunca rechazan, aunque el generador sea malo.
- **Elegir clases con muy pocos valores esperados.** La aproximación chi-cuadrada falla cuando $n/k$ es menor que 5.

:::figura[Falsa alarma: con la semilla 7, el Mersenne Twister tiene frecuencias normales pero la prueba de corridas da valor p 0.034; al 5 % se rechazaría por azar.]{componente="RandomLab"}
```yaml
modo: pruebas
generador: mt
valores:
  n: 2000
  k: 10
  semilla: 7
```
:::

## Conexiones

Ponen a prueba los [[generadores-de-numeros-pseudoaleatorios]], como el [[generador-congruencial-lineal]] y el [[mersenne-twister]]. La prueba de frecuencias usa la [[distribucion-chi-cuadrada]], y la de corridas, la aproximación por la [[distribucion-normal]]. Son pruebas de bondad de ajuste a la [[distribucion-uniforme-continua]] y de independencia, que se estudian en inferencia. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Ji cuadrada de frecuencias]
$$
\chi^{2} = \sum_{j=1}^{k}\frac{(O_j - n/k)^{2}}{n/k} \approx \chi^{2}_{k-1}
$$

- $O_j$: conteo de la clase $j$; $n$: valores; $k$: clases.
:::

:::formula[Corridas arriba y abajo]
$$
\mathbb{E}[R] = \frac{2n - 1}{3}, \qquad \operatorname{Var}(R) = \frac{16n - 29}{90}, \qquad Z = \frac{R - \mathbb{E}[R]}{\sqrt{\operatorname{Var}(R)}}
$$

- $R$: corridas observadas; $Z$: aproximadamente normal estándar.
:::

:::formula[Correlación serial]
$$
r_1 = \frac{\sum_{i=1}^{n-1}(u_i - \bar{u})(u_{i+1} - \bar{u})}{\sum_{i=1}^{n}(u_i - \bar{u})^{2}}
$$

- $u_i$: valores; $\bar{u}$: su promedio; para valores independientes $r_1$ es del orden de $1/\sqrt{n}$.
:::
