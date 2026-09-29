---
id: series-y-convergencia-de-series
titulo: Series y convergencia de series
titulo_en: Series and convergence of series
alias:
  - serie infinita
  - sumas parciales
  - serie armónica
  - convergencia absoluta
modulo: 0
submodulo: '0.1'
orden: 18
nivel: basico
prerrequisitos:
  - sucesiones
etiquetas:
  - series
  - sumas parciales
  - convergencia
  - serie armónica
resumen: >
  Una serie es la suma de los infinitos términos de una sucesión. Converge si la sucesión de sus sumas
  parciales tiene límite; que los términos tiendan a cero es necesario pero no suficiente.
formula: '\sum_{n=1}^{\infty} a_n = \lim_{N \to \infty} S_N,\qquad S_N = \sum_{n=1}^{N} a_n'
visualizacion:
  componente: SequenceSeries
  parametros:
    modo: serie
    serie: basilea
    series:
      - basilea
      - armonica
      - armonica-alternada
      - factorial
      - grandi
    terminos: 100
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un corredor de fondo recorre cada día una distancia menor que el anterior. Si el primer día corre 1 km, el segundo $1/4$, el tercero $1/9$, y así con $1/n^2$, la distancia total acumulada crece cada día, pero nunca supera 1.65 km: se acerca a un valor fijo. Si en cambio corriera $1/n$ km el día $n$, los recorridos diarios también se harían tan pequeños como se quiera, y sin embargo el total acumulado superaría cualquier distancia, por grande que sea, si se esperan suficientes días.

Sumar infinitos términos no es una operación que pueda terminarse. Lo que tiene sentido es mirar los totales acumulados después de 1, 2, 3, ... términos y preguntar si esa sucesión se estabiliza. Que los términos se hagan pequeños no alcanza; tienen que hacerse pequeños lo bastante rápido.

## Definición

Dada una sucesión $(a_n)$, la **suma parcial** $N$-ésima es $S_N = \sum_{n=1}^{N} a_n$.

:::definicion[Serie convergente]
La serie $\sum_{n=1}^{\infty} a_n$ **converge** a $S$ si $S_N \to S$, y entonces se escribe $\sum_{n=1}^{\infty} a_n = S$. Si $(S_N)$ no tiene límite, la serie **diverge**.
:::

La serie **converge absolutamente** si $\sum |a_n|$ converge, y **converge condicionalmente** si converge pero no absolutamente.

## Cómo usar la visualización

Las barras claras son los términos $a_n$ y la línea es la sucesión de sumas parciales $S_n$. Cuando la serie converge, una línea discontinua marca su suma. El panel muestra el último término, la suma parcial y la suma de la serie.

Con la suma de $1/n^2$ las sumas parciales se acercan a $\pi^2/6 \approx 1.645$. Con la serie armónica los términos se ven casi iguales a los anteriores, pero la línea sigue subiendo sin estabilizarse; después de 100 términos la suma parcial supera 5. Con la armónica alternada las sumas parciales oscilan alrededor de $\log 2$ con saltos cada vez menores. La serie de Grandi alterna entre 1 y 0 y no converge.

## Ejemplo

Un brazo robótico se aproxima a su posición final con movimientos cada vez más cortos: en el movimiento $n$ avanza $a_n = \frac{1}{n(n+1)}$ metros. Se calcula la distancia total recorrida, es decir, la suma de la serie.

1. Por fracciones parciales, $\frac{1}{n(n+1)} = \frac{1}{n} - \frac{1}{n+1}$.
2. La suma parcial es telescópica: $S_N = \left(1 - \frac{1}{2}\right) + \left(\frac{1}{2} - \frac{1}{3}\right) + \dots + \left(\frac{1}{N} - \frac{1}{N+1}\right) = 1 - \frac{1}{N+1}$.
3. Por tanto $S_N \to 1$ y $\sum_{n=1}^{\infty} \frac{1}{n(n+1)} = 1$.
4. Con $N = 9$: $S_9 = 1 - \frac{1}{10} = 0.9$, así que tras nueve movimientos el brazo ha recorrido 90 cm de un total de 1 m.

## Propiedades

- **Condición necesaria:** si $\sum a_n$ converge, entonces $a_n \to 0$. El recíproco es falso.
- **Serie armónica:** $\sum 1/n$ diverge. **Series $p$:** $\sum 1/n^p$ converge si y solo si $p > 1$.
- **Comparación:** si $0 \le a_n \le b_n$ y $\sum b_n$ converge, entonces $\sum a_n$ converge.
- **Criterio de la razón:** si $|a_{n+1}/a_n| \to \rho < 1$, la serie converge absolutamente; si $\rho > 1$, diverge.
- **Series alternantes:** si $b_n$ decrece a 0, $\sum (-1)^{n+1} b_n$ converge.
- La convergencia absoluta implica la convergencia, y solo en ese caso el reordenamiento de términos no cambia la suma.
- **Linealidad:** $\sum (c a_n + b_n) = c \sum a_n + \sum b_n$ si ambas convergen.

:::demostracion
Para la divergencia de la serie armónica agrupamos términos: $1 + \frac{1}{2} + \left(\frac{1}{3} + \frac{1}{4}\right) + \left(\frac{1}{5} + \dots + \frac{1}{8}\right) + \dots$. Cada grupo entre paréntesis suma al menos $\frac{1}{2}$, así que $S_{2^k} \ge 1 + \frac{k}{2}$, que crece sin cota.
:::

## Errores comunes

- **Concluir la convergencia porque $a_n \to 0$.** La serie armónica es el contraejemplo clásico.
- **Juzgar por las sumas parciales visibles.** La armónica crece como $\log N$: tras un millón de términos apenas supera 14, y aun así diverge.
- **Reordenar una serie condicionalmente convergente.** Reordenando la armónica alternada se puede obtener cualquier suma.
- **Confundir la sucesión de términos con la sucesión de sumas parciales.** Converger se refiere a la segunda.

## Conexiones

Una serie es el límite de la sucesión de sumas parciales, así que depende del concepto de límite de [[sucesiones]]. La [[serie-geometrica]] es el caso que se suma en forma cerrada, y la [[notacion-sumatoria-y-productoria]] es el lenguaje con el que se escriben. En probabilidad, la esperanza de una variable discreta es una serie, y existe solo cuando converge absolutamente.
